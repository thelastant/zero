from apps.models import CommonMovie
import json


class GetMovieInfo(object):
    def __init__(self, current_page=1, rows=1):
        self.data_count = 0
        self.total_page = 0
        self.current = int(current_page)
        self.rows = int(rows)

    def get_movie(self):
        movie_obj_list = CommonMovie.objects.all()
        self.data_count = len(movie_obj_list)
        return movie_obj_list

    def deal_data(self):
        movie_obj = self.get_movie()
        self.total_page = int(self.data_count / self.rows)
        if self.current < self.total_page:
            next_page = self.current + 1
        else:
            next_page = None
        if self.current > 1:
            previous = self.current - 1
        else:
            previous = None
        min_index = self.current * self.rows - 1
        max_index = (self.current + 1) * self.rows - 1
        data_list = movie_obj[min_index:max_index]
        movie_info_list = []

        for data in data_list:
            movie_dict = {}
            movie_dict["title"] = data.title
            movie_dict["author"] = data.author
            movie_dict["hot"] = data.hot
            movie_info_list.append(movie_dict)
        return {"total_page": self.total_page, "data": movie_info_list, "next_page": next_page, "previous": previous}

    def run(self):
        data = self.deal_data()
        return data
